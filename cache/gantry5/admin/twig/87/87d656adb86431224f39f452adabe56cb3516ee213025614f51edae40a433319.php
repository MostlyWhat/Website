<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* ajax/filepicker/files.html.twig */
class __TwigTemplate_f5de9d3f42608aec1e8f4dd64cab640d2e9519ac0b613da361ff22211f46391d extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 21
        echo "
";
        // line 22
        $context["macro"] = $this;
        // line 23
        echo "
<ul class=\"g-list-labels\">
    <li>
        <span class=\"g-file-thumb\"></span>
        <span class=\"g-file-name\">";
        // line 27
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_NAME"), "html", null, true);
        echo "</span>
        <span class=\"g-file-size\">";
        // line 28
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SIZE"), "html", null, true);
        echo "</span>
        <span class=\"g-file-mtime\">";
        // line 29
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_LATEST_MODIFIED"), "html", null, true);
        echo "</span>
    </li>
</ul>
<ul>
    ";
        // line 33
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["files"] ?? null));
        foreach ($context['_seq'] as $context["index"] => $context["file"]) {
            // line 34
            echo "        <li data-file=\"";
            echo twig_escape_filter($this->env, twig_jsonencode_filter($context["file"]), "html_attr");
            echo "\" data-file-url=\"";
            echo twig_escape_filter($this->env, $this->getAttribute($context["file"], "pathname", []), "html", null, true);
            echo "\"";
            echo ((($this->getAttribute($context["file"], "pathname", []) == ($context["value"] ?? null))) ? (" class=\"selected\"") : (""));
            echo "
            title=\"";
            // line 35
            echo twig_escape_filter($this->env, $this->getAttribute($context["file"], "filename", []), "html", null, true);
            echo " (";
            echo $context["macro"]->getbytesToSize($this->getAttribute($context["file"], "size", []));
            echo ")\">
            ";
            // line 36
            if ($this->getAttribute($context["file"], "isInCustom", [])) {
                // line 37
                echo "                <span class=\"g-file-delete\" data-g-file-delete data-dz-remove title=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILE_REMOVE"), "html", null, true);
                echo "\">
                    <i class=\"far fa-fw fa-trash-alt\" aria-hidden=\"true\"></i>
                </span>
            ";
            }
            // line 41
            echo "            ";
            if ($this->getAttribute($context["file"], "isImage", [])) {
                // line 42
                echo "                <span class=\"g-file-preview\" data-g-file-preview title=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILE_PREVIEW"), "html", null, true);
                echo "\">
                    <i class=\"fa fa-fw fa-eye\" aria-hidden=\"true\"></i>
                </span>
                <div class=\"g-thumb g-image g-image-";
                // line 45
                echo twig_escape_filter($this->env, $this->getAttribute($context["file"], "extension", []), "html", null, true);
                echo "\">
                    <div style=\"background-image: url('";
                // line 46
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute($context["file"], "pathname", [])), "html", null, true);
                echo "')\"></div>
                </div>
            ";
            } else {
                // line 49
                echo "                <div class=\"g-thumb\">";
                echo twig_escape_filter($this->env, $this->getAttribute($context["file"], "extension", []), "html", null, true);
                echo "</div>
            ";
            }
            // line 51
            echo "
            <span class=\"g-file-name\">";
            // line 52
            echo twig_escape_filter($this->env, $this->getAttribute($context["file"], "filename", []), "html", null, true);
            echo "</span>
            <span class=\"g-file-size\">";
            // line 53
            echo $context["macro"]->getbytesToSize($this->getAttribute($context["file"], "size", []));
            echo "</span>
            <span class=\"g-file-mtime\">";
            // line 54
            echo twig_escape_filter($this->env, twig_date_format_filter($this->env, $this->getAttribute($context["file"], "mtime", []), "j M o"), "html", null, true);
            echo "</span>
        </li>
    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['index'], $context['file'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 57
        echo "
    ";
        // line 58
        if ((twig_length_filter($this->env, ($context["files"] ?? null)) == 0)) {
            // line 59
            echo "        <li class=\"no-files-found\"><h2>";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FOLDER_EMPTY"), "html", null, true);
            echo "</h2></li>
    ";
        }
        // line 61
        echo "</ul>
";
    }

    // line 1
    public function getbytesToSize($__bytes__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "bytes" => $__bytes__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start(function () { return ''; });
        try {
            // line 2
            ob_start(function () { return ''; });
            // line 3
            echo "        ";
            $context["kilobyte"] = 1024;
            // line 4
            echo "        ";
            $context["megabyte"] = (($context["kilobyte"] ?? null) * 1024);
            // line 5
            echo "        ";
            $context["gigabyte"] = (($context["megabyte"] ?? null) * 1024);
            // line 6
            echo "        ";
            $context["terabyte"] = (($context["gigabyte"] ?? null) * 1024);
            // line 7
            echo "
        ";
            // line 8
            if ((($context["bytes"] ?? null) < ($context["kilobyte"] ?? null))) {
                // line 9
                echo "            ";
                echo twig_escape_filter($this->env, (($context["bytes"] ?? null) . " B"), "html", null, true);
                echo "
        ";
            } elseif ((            // line 10
($context["bytes"] ?? null) < ($context["megabyte"] ?? null))) {
                // line 11
                echo "            ";
                echo twig_escape_filter($this->env, (twig_number_format_filter($this->env, (($context["bytes"] ?? null) / ($context["kilobyte"] ?? null)), 2, ".") . " KB"), "html", null, true);
                echo "
        ";
            } elseif ((            // line 12
($context["bytes"] ?? null) < ($context["gigabyte"] ?? null))) {
                // line 13
                echo "            ";
                echo twig_escape_filter($this->env, (twig_number_format_filter($this->env, (($context["bytes"] ?? null) / ($context["megabyte"] ?? null)), 2, ".") . " MB"), "html", null, true);
                echo "
        ";
            } elseif ((            // line 14
($context["bytes"] ?? null) < ($context["terabyte"] ?? null))) {
                // line 15
                echo "            ";
                echo twig_escape_filter($this->env, (twig_number_format_filter($this->env, (($context["bytes"] ?? null) / ($context["gigabyte"] ?? null)), 2, ".") . " GB"), "html", null, true);
                echo "
        ";
            } else {
                // line 17
                echo "            ";
                echo twig_escape_filter($this->env, (twig_number_format_filter($this->env, (($context["bytes"] ?? null) / ($context["terabyte"] ?? null)), 2, ".") . " TB"), "html", null, true);
                echo "
        ";
            }
            // line 19
            echo "    ";
            echo trim(preg_replace('/>\s+</', '><', ob_get_clean()));
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "ajax/filepicker/files.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  211 => 19,  205 => 17,  199 => 15,  197 => 14,  192 => 13,  190 => 12,  185 => 11,  183 => 10,  178 => 9,  176 => 8,  173 => 7,  170 => 6,  167 => 5,  164 => 4,  161 => 3,  159 => 2,  147 => 1,  142 => 61,  136 => 59,  134 => 58,  131 => 57,  122 => 54,  118 => 53,  114 => 52,  111 => 51,  105 => 49,  99 => 46,  95 => 45,  88 => 42,  85 => 41,  77 => 37,  75 => 36,  69 => 35,  60 => 34,  56 => 33,  49 => 29,  45 => 28,  41 => 27,  35 => 23,  33 => 22,  30 => 21,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "ajax/filepicker/files.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\ajax\\filepicker\\files.html.twig");
    }
}
